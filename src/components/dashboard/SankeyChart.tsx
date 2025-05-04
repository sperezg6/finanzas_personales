"use client"

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { sankey, sankeyLinkHorizontal } from 'd3-sankey'

// Types for our Sankey data
export interface SankeyNode {
  id: string
  name: string
  category?: string
}

export interface SankeyLink {
  source: string
  target: string
  value: number
}

export interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

interface SankeyChartProps {
  data: SankeyData
  width?: number
  height?: number
  nodePadding?: number
  nodeWidth?: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export default function SankeyChart({
  data,
  width = 800,
  height = 500,
  nodePadding = 20,
  nodeWidth = 25,
  margin = { top: 10, right: 150, bottom: 10, left: 150 }
}: SankeyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes.length) return

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove()

    // Prepare the D3 sankey diagram
    const sankeyLayout = sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]
      ])
    
    // Format the data for D3 sankey
    const sankeyData = {
      nodes: data.nodes.map(node => ({ ...node })),
      links: data.links.map(link => ({
        ...link,
        source: link.source,
        target: link.target,
        value: link.value
      }))
    }
    
    // Generate the sankey diagram
    const { nodes, links } = sankeyLayout(sankeyData as any)
    
    // Create the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
    
    // Define gradient colors based on category
    const getNodeColor = (category?: string) => {
      const colors: Record<string, string> = {
        income: '#77c596', // Green for income
        expense: '#6474b9', // Purple for expenses
        savings: '#8fb0d5', // Blue for savings
        default: '#a6d854'
      }
      return colors[category || 'default']
    }

    // Create gradient definitions
    const defs = svg.append('defs')
    
    // Create gradient for each link
    links.forEach((link: any, i: number) => {
      const gradientId = `linkGradient-${i}`
      const gradient = defs.append('linearGradient')
        .attr('id', gradientId)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', link.source.x1)
        .attr('y1', (link.source.y0 + link.source.y1) / 2)
        .attr('x2', link.target.x0)
        .attr('y2', (link.target.y0 + link.target.y1) / 2)
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', getNodeColor(link.source.category))
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', getNodeColor(link.target.category))
    })
    
    // Create the links between nodes with gradients
    const link = svg.append('g')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', sankeyLinkHorizontal() as any)
      .attr('fill', 'none')
      .attr('stroke', (d: any, i: number) => `url(#linkGradient-${i})`)
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('opacity', 0.7)
    
    // Create the node rectangles
    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`)
    
    // Add the rectangles for the nodes
    node.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => getNodeColor(d.category))
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4)
      .attr('opacity', 0.9)
      .attr('stroke', (d: any) => {
        const color = d3.color(getNodeColor(d.category));
        return color ? color.darker(0.5).toString() : '#000'; // Fallback to black if undefined
      })
      .attr('stroke-width', 1)
    
    // Improved label positioning
    // Add labels to the nodes
    const nodeLabels = node.append('g')
      .attr('class', 'node-label')
    
    // Add node names (more prominent)
    nodeLabels.append('text')
      .attr('x', (d: any) => {
        return d.x0 < width / 3 ? (d.x1 - d.x0) + 6 : -6 // Left nodes: right side, right nodes: left side
      })
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 - 8)
      .attr('text-anchor', (d: any) => d.x0 < width / 3 ? 'start' : 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-weight', 'bold')
      .attr('font-size', 14)
      .attr('fill', '#333')
      .text((d: any) => d.name)
    
    // Add values below the names
    nodeLabels.append('text')
      .attr('x', (d: any) => {
        return d.x0 < width / 3 ? (d.x1 - d.x0) + 6 : -6
      })
      .attr('y', (d: any) => (d.y1 - d.y0) / 2 + 12)
      .attr('text-anchor', (d: any) => d.x0 < width / 3 ? 'start' : 'end')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 12)
      .attr('fill', '#555')
      .text((d: any) => `$${d3.format(',')(Math.round(d.value))}`)
    
    // Add hover effects
    node
      .on('mouseover', function(event: MouseEvent, d: any) {
        // Highlight node
        d3.select(this).select('rect')
          .attr('opacity', 1)
          .attr('stroke-width', 2)
        
        // Highlight connected links
        link
          .filter((l: any) => l.source.id === d.id || l.target.id === d.id)
          .attr('opacity', 1)
          .attr('stroke-width', (l: any) => Math.max(2, l.width))
      })
      .on('mouseout', function() {
        // Reset node
        d3.select(this).select('rect')
          .attr('opacity', 0.9)
          .attr('stroke-width', 1)
        
        // Reset links
        link
          .attr('opacity', 0.7)
          .attr('stroke-width', (d: any) => Math.max(1, d.width))
      })

  }, [data, width, height, nodeWidth, nodePadding, margin])

  return (
    <div className="sankey-container w-full overflow-x-auto">
      <svg ref={svgRef} width="100%" height={height} preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${width} ${height}`} />
    </div>
  )
}